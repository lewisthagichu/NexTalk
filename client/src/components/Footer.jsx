import { IoLogoGithub } from 'react-icons/io5';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <small>
        Copyright © {currentYear} lewisthagichu 
      </small>
      <a href="https://github.com/lewisthagichu" target="_blank">
        <div className='git-logo'><IoLogoGithub color='black'/></div>
      </a>
    </footer>
  );
}

export default Footer;