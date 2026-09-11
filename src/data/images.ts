import heroImage from './a.png';
import heroAltImage from './b.png';
import firstFloatingTopLeftImage from './t.jpg';
import firstFloatingTopRightImage from './g.jpg';
import firstFloatingBottomLeftImage from './p.jpg';
import firstFloatingBottomRightImage from './s.jpg';
import secondFloatingTopLeftImage from './p2.jpg';
import secondFloatingTopRightImage from './c.jpg';
import secondFloatingBottomLeftImage from './s2.jpg';
import secondFloatingBottomRightImage from './pk.jpg';
import fashionImage from './o.jpg';
import capsImage from './banie.jpg';
import hoodiesImage from './ct.jpg';
import airMax270Image from './cl.jpg';
import cl1Image from './cl1.jpg';
import cl2Image from './cl2.jpg';
import cl3Image from './cl3.jpg';
import cl4Image from './cl4.jpg';
import t1Image from './t1.jpg';
import t2Image from './t2.jpg';
import t3Image from './t3.jpg';
import t4Image from './t4.png';
import t5Image from './t5.jpg';
import loginFormImage from './form.png';
import newCollectionImage from './n.png';

const publicImage = (fileName: string) => `/${fileName}`;

export const IMG = {
  hero: heroImage,
  heroAlt: heroAltImage,
  loginForm: loginFormImage,
  newCollection: newCollectionImage,
  heroFloating: {
    first: {
      topLeft: firstFloatingTopLeftImage,
      topRight: firstFloatingTopRightImage,
      bottomLeft: firstFloatingBottomLeftImage,
      bottomRight: firstFloatingBottomRightImage
    },
    second: {
      topLeft: secondFloatingTopLeftImage,
      topRight: secondFloatingTopRightImage,
      bottomLeft: secondFloatingBottomLeftImage,
      bottomRight: secondFloatingBottomRightImage
    }
  },
  hoodie: publicImage('f4eb3deb-8e35-4d14-9084-bbeb169024c0.jpg'),
  sneakers: publicImage('de8ff427-a86f-48a2-84d6-c34189d7522a.jpg'),
  headphones: publicImage('af4efa53-1877-4ddc-a05d-ed91d7b9cade.jpg'),
  watch: publicImage('25282c0e-9885-425b-8cdd-fb536d120173.jpg'),
  bottle: publicImage('3196281d-b195-4793-8942-9d1e21bb6ffe.jpg'),
  sunglasses: publicImage('7ca15c14-4f61-4a28-bcb5-c71eebd189b3.jpg'),
  serum: publicImage('4ef80d43-d0e7-451f-afe0-a0e2b1805595.jpg'),
  fitness: publicImage('3daf8752-b3f6-45c1-bc91-5ba1967c699b.jpg'),
  homeDecor: publicImage('412a58b5-f3cf-467d-84d4-7da892d8d6c9.jpg'),
  fashion: fashionImage,
  airMax270: airMax270Image,
  mensJeans: secondFloatingTopLeftImage,
  mensTshirts: secondFloatingTopRightImage,
  mensShoes: secondFloatingBottomLeftImage,
  mensCaps: capsImage,
  mensHoodies: hoodiesImage,
  clients: [cl1Image, cl2Image, cl3Image, cl4Image],
  testimonials: [t1Image, t2Image, t3Image, t4Image, t5Image],
  blogTech: publicImage('c83bdc22-51bf-45cc-b816-77537e616edc.jpg'),
  blogFashion: publicImage('0c830b8b-8ec3-4a49-9911-b18bef76f3d8.jpg'),
  promoFitness: publicImage('b5df3af9-1371-4353-828d-4d1ad3462b59.jpg'),
  team: publicImage('e6785a1c-5a74-486b-b8bd-b6816fb64635.jpg'),
  bag: publicImage('917c738d-f791-4fcb-94ee-ba02efeb9b2c.jpg'),
  tshirt: publicImage('df4e4cbd-af35-4de6-b503-e4a9fe5d0fac.jpg'),
  pants: publicImage('0eb2783b-0b7a-4a0e-b29e-a3e46912f4e1.jpg'),
  avatar1: t1Image,
  avatar2: t2Image,
  avatar3: t3Image,
  avatar4: t4Image,
  avatar5: t5Image
};
