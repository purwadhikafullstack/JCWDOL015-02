import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold">Washted.</h3>
          <p>
            We will use all our strength to shorten the time it takes for the
            laundry to take place
          </p>
        </div>
        <div>
          <h4 className="font-bold">Contact</h4>
          <ul>
            <li>Partners</li>
            <li>Press</li>
            <li>Help</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Follow us</h4>
          <ul>
            <li>Facebook</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
            <li>Twitter</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
