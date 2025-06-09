import "../../assets/css/StoreFooter.css";
import "../../App.css";

function StoreFooter() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            A global platform for artists and designers to sell, connect, and
            grow. Fueling creativity and empowering independence - worldwide.
          </p>
          <div className="social-links">
            <a href="#!">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#!">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#!">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#!">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#!">
              <i className="fab fa-pinterest"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Useful Links</h3>
          <ul className="footer-links">
            <li>
              <a href="#!">Privacy Policy</a>
            </li>
            <li>
              <a href="#!">Terms of Service</a>
            </li>
            <li>
              <a href="#!">Shipping Information</a>
            </li>
            <li>
              <a href="#!">Return Policy</a>
            </li>
            <li>
              <a href="#!">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Categories</h3>
          <ul className="footer-links">
            <li>
              <a href="#!">Shirts</a>
            </li>
            <li>
              <a href="#!">Hoodies</a>
            </li>
            <li>
              <a href="#!">Socks</a>
            </li>
            <li>
              <a href="#!">Posters</a>
            </li>
            <li>
              <a href="#!">Tote Bags</a>
            </li>
            {/* <li>
              <a href="#!">Hats</a>
            </li> */}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter for updates and exclusive offers.</p>
          <form className="newsletter-form newsletter-form-footer">
            <input
              type="email"
              className="newsletter-input "
              placeholder="Enter your email"
              required
            />
            <button type="submit" className=" margin-zero-important">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <svg
          width="85"
          height="53"
          viewBox="0 0 85 53"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M56.3535 32.4644L50.8048 38.0283C50.4148 38.4193 49.7893 38.4193 49.3993 38.0283L43.8506 32.4644C43.4607 32.0734 42.8351 32.0734 42.4452 32.4644L40.341 34.5743C39.9511 34.9653 39.9511 35.5926 40.341 35.9836L45.8897 41.5475C46.2797 41.9385 46.2797 42.5658 45.8897 42.9568L40.341 48.5207C39.9511 48.9117 39.9511 49.539 40.341 49.93L42.4452 52.0399C42.8351 52.4309 43.4607 52.4309 43.8506 52.0399L49.3993 46.476C49.7893 46.085 50.4148 46.085 50.8048 46.476L56.3535 52.0399C56.7434 52.4309 57.369 52.4309 57.7589 52.0399L59.863 49.93C60.253 49.539 60.253 48.9117 59.863 48.5207L54.3143 42.9568C53.9244 42.5658 53.9244 41.9385 54.3143 41.5475L59.863 35.9836C60.253 35.5926 60.253 34.9653 59.863 34.5743L57.7589 32.4644C57.369 32.0734 56.7434 32.0734 56.3535 32.4644Z"
            fill="#EAAD00"
          />
          <path
            d="M25.1629 28.291L37.8217 15.6168C38.4405 14.9973 38.4405 14.0035 37.8217 13.384L24.918 0.464634C24.2992 -0.154878 23.3066 -0.154878 22.6879 0.464634L0.46407 22.7154C-0.15469 23.3349 -0.15469 24.3287 0.46407 24.9482L3.8028 28.291C4.42156 28.9105 5.41415 28.9105 6.03291 28.291L13.0713 21.2441C13.6643 20.6504 14.6311 20.6246 15.2499 21.1925L22.9973 28.3297C23.616 28.8976 24.5828 28.8847 25.1758 28.2781L25.1629 28.291ZM24.918 11.6029L26.7098 13.3969C27.3286 14.0164 27.3286 15.0102 26.7098 15.6298L24.9438 17.3979C24.3508 17.9916 23.384 18.0175 22.7652 17.4496L20.9089 15.733C20.2515 15.1264 20.2257 14.0939 20.8574 13.4615L22.7008 11.6158C23.3195 10.9963 24.3121 10.9963 24.9309 11.6158L24.918 11.6029Z"
            fill="#090A10"
          />
          <path
            d="M60.2257 0.532279L24.915 35.838C24.296 36.457 23.3029 36.457 22.6839 35.838L14.1335 27.2888C13.5144 26.6699 12.5214 26.6699 11.9024 27.2888L8.56218 30.6286C7.94314 31.2475 7.94314 32.2404 8.56218 32.8594L22.671 46.9662C23.29 47.5851 24.2831 47.5851 24.9021 46.9662L43.7697 28.1012C44.0664 27.8046 44.4662 27.637 44.8788 27.637H66.7772C68.1829 27.637 68.8793 29.3262 67.8863 30.3191L57.195 41.0088C56.576 41.6278 56.576 42.6207 57.195 43.2396L60.5353 46.5793C61.1543 47.1983 62.1473 47.1983 62.7664 46.5793L84.5357 24.813C85.1548 24.1941 85.1548 23.2012 84.5357 22.5823L62.4697 0.519386C61.8507 -0.099561 60.8577 -0.099561 60.2386 0.519386L60.2257 0.532279ZM66.7772 19.7841H55.9054C54.4997 19.7841 53.8033 18.0949 54.7963 17.102L60.2386 11.6604C60.8577 11.0415 61.8507 11.0415 62.4697 11.6604L67.9121 17.102C68.9051 18.0949 68.1958 19.7841 66.803 19.7841H66.7772Z"
            fill="#090A10"
          />
        </svg>
      </div>
    </footer>
  );
}

export default StoreFooter;
