import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getCategories,
  getBanners,
  getEvents,
  getVideos,
  getTrendingProducts,
} from "../api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [trending, setTrendingProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [video, setVideo] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, bannersData, videosData, trendingData, eventsData] =
          await Promise.all([
            getCategories(),
            getBanners(),
            getVideos(),
            getTrendingProducts(),
            getEvents(),
          ]);

        setCategories(cats || []);
        setBanners(bannersData.images || bannersData || []);
        setVideo(videosData[0]?.url || null);
        setTrendingProducts(trendingData || []);
        setEvents(eventsData || []);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      }
    };

    fetchData();
  }, []);

  const chunkArray = (array, size) => {
    let result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  return (
    <div className="home">
      {/* Banners */}
      <section
        className="banner"
        style={{ "--banner-count": banners.length || 1 }}
      >
        <div className="banner-track">
          {banners.length ? (
            banners.map((img, i) => (
              <div className="slide" key={i}>
                <img src={img} alt={`Banner ${i + 1}`} />
              </div>
            ))
          ) : (
            <div className="slide">
              <img src="/assets/placeholder.jpg" alt="Default Banner" />
            </div>
          )}
        </div>
      </section>

      {/* Video */}
      {video && (
        <section className="video">
          <video autoPlay muted loop playsInline>
            <source src={video} type="video/mp4" />
          </video>
        </section>
      )}

      {/* Categories */}
      <section className="categories">
        <h2 className="section-title">Featured Categories</h2>

        {/* 🔥 Desktop Grid (unchanged) */}
        <div className="grid desktop-grid">
          {categories.map((cat) => (
            <Link
              to={`/products?category=${cat.slug}`}
              key={cat._id}
              className="item"
            >
              <img src={cat.image} alt={cat.name} />
              <div className="overlay"></div>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* 🔥 Mobile Slider */}
        <div className="mobile-slider">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1} // 👈 shows next slide peek
            spaceBetween={12}
            pagination={{ clickable: true, el: ".categories-pagination" }}
          >
            {chunkArray(categories, 4).map((group, index) => (
              <SwiperSlide key={index}>
                <div className="grid mobile-grid">
                  {group.map((cat) => (
                    <Link
                      to={`/products?category=${cat.slug}`}
                      key={cat._id}
                      className="item"
                    >
                      <img src={cat.image} alt={cat.name} />
                      <div className="overlay"></div>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="categories-pagination"></div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="trend">
        <h2 className="section-title">Trending Products</h2>

        {/* DESKTOP GRID */}
        <div className="products desktop-products">
          {trending.map((prod) => (
            <Link to={`/products/details/${prod._id}`} key={prod._id}>
              <div className="product-card">
                <div className="product-img">
                  <img src={prod.mainImage} alt={prod.title} />
                </div>
                <div className="product-info">
                  <h3>{prod.title}</h3>
                  <p>₨.{prod.price?.toLocaleString()}.00</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* MOBILE SWIPER */}
        <div className="mobile-trending">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            spaceBetween={12}
            pagination={{ clickable: true, el: ".trending-pagination" }}
          >
            {chunkArray(trending, 4).map((group, index) => (
              <SwiperSlide key={index}>
                <div className="trend-grid">
                  {group.map((prod) => (
                    <Link to={`/products/details/${prod._id}`} key={prod._id}>
                      <div className="product-card">
                        <div className="product-img">
                          <img src={prod.mainImage} alt={prod.title} />
                        </div>
                        <div className="product-info">
                          <h3>{prod.title}</h3>
                          <p>₨.{prod.price?.toLocaleString()}.00</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="trending-pagination"></div>
        </div>
      </section>

      {/* Events */}
      <section className="events">
        <h2 className="section-title">Events & Exhibitions</h2>
        <div className="events-container">
          {events.length > 0 ? (
            events.map((event) => (
              <div className="event-card" key={event._id}>
                <img src={event.image} alt={event.title} />
                <div className="event-info">
                  <h3>{event.title}</h3>
                  {event.description && <p>{event.description}</p>}
                  {event.date && <p className="date">📅 {event.date}</p>}
                </div>
              </div>
            ))
          ) : (
            <p className="no-events">No upcoming events at the moment.</p>
          )}
        </div>
      </section>
      <section className="about-section">
        <div className="about-container">
          <h2 className="section-title">Our Story</h2>
          <p className="about-text">
            Welcome to <strong>BAAJI by Hina Fahad</strong>, where fashion meets
            elegance.
            <br />
            <br />
            In South Asian culture, especially in Pakistan, <em>“Baaji”</em> is
            a term of respect and affection — used to refer to an elder sister,
            a close friend, or a woman who inspires admiration.
            <br />
            <br />
            At <strong>BAAJI</strong>, this word represents more than just a
            name — it reflects our values of
            <strong> care, respect, and connection</strong>. We aim to create a
            brand that makes every customer feel
            <strong> comfortable, confident, and empowered</strong>.<br />
            <br />
            Rooted in cultural significance and timeless style,{" "}
            <strong>BAAJI by Hina Fahad</strong> celebrates the spirit of women
            — their <strong>strength, grace, and individuality</strong> —
            through elegant and modern fashion.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
