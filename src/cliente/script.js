const links = document.querySelectorAll('.links');
const sections = document.querySelectorAll('section');

function activeMenu() {
    let len = sections.length;
    console.log(len)
    while (--len && window.scrollY + 97 < sections[len].offsetTop) {}
      links.forEach((ltx) => ltx.classList.remove('active'));
      links[len].classList.add('active');
    }
  
activeMenu();
window.addEventListener('scroll', activeMenu);