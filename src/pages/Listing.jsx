import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        scrollbar={{ draggable: true }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
                height: '300px',
                width: '100%',
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share link" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          {listing.type === 'rent' && '/ month'}
        </p>
        <div className="listingLocation">{listing.location}</div>
        <p className="listingType">Type: {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
        {listing.offer && <p className="discountPrice">${listing.regularPrice - listing.discountedPrice} discount</p>}
        <p className="listingDescription">{listing.description}</p>
        <ul className="listingDetailsList">
          <li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}</li>
          <li>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}</li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>
        <div className="listingLocationTitle">Location</div>
        <div className="leafletContainer">
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
            />

            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
        {auth.currentUser?.uid !== listing.userRef && (
          <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton">
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
