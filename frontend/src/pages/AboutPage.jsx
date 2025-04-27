import React from 'react';
import ABimg1 from '../assets/img/HBCafeAbout-img1.jpg';
import ABimg2 from '../assets/img/HBCafeAbout-img2.png';
import ABimg3 from '../assets/img/HBCafeAbout-img3.png';
import ABimg4 from '../assets/img/HBCafeAbout-img4.png';

const AboutPage = () => {
  return (
    <div className='bg-zinc-100 font-serif pt-6'>
      <h1 className="text-center text-3xl md:text-4xl font-bold mb-6 md:mb-8">About HypeBeans</h1>
      
      {/* First Section */}
      <div className='max-w-[95%] mx-auto tracking-widest py-6 grid grid-cols-1 md:grid-cols-[4fr_6fr] gap-6 md:gap-10 bg-zinc-800 px-4 md:px-10'>
        <div
          className="h-64 md:h-auto"
          style={{
            backgroundImage: `url(${ABimg1})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}>
        </div>
        <p className="text-lg md:text-2xl font-500 tracking-widest text-justify text-zinc-300 leading-7 md:leading-10 py-4 md:py-10">
          At HypeBeans Cafe, we believe great taste is more than just flavor it is an experience. Founded by Joseph Nicholas Valentin, who gained valuable café industry experience while working in the Middle East, HypeBeans was built on a passion for quality, consistency, and community. From premium beverages to satisfying snacks, everything we serve is crafted to hit the sweet spot every time. Whether you're studying, working, catching up with friends, or simply taking a break, our cozy and welcoming space is designed to make everyone feel at home. We're here to fuel your day, spark connections, and deliver a café experience that keeps you coming back.
        </p>
      </div>

      {/* Owner's Profile */}
      <div className='mt-8 max-w-[95%] mx-auto'>
        <hr className='mb-1'/><hr />
        <div className='grid grid-cols-1 md:grid-cols-[6fr_4fr] py-5'>
          <div className="order-2 md:order-1">
            <h2 className='text-2xl md:text-4xl text-zinc-600 font-bold mb-2 text-center'>Owner's Profile</h2>
            <p className='text-lg md:text-2xl text-zinc-700 font-500 tracking-widest py-4 md:py-8 leading-7 md:leading-10 max-w-[90%] text-justify mx-auto'>
              HypeBeans Cafe is proudly founded by Joseph Nicholas Valentin, a passionate entrepreneur with hands-on experience in the café and hospitality industry. Before bringing his vision to life locally, Joseph spent time working in the Middle East, where he deepened his understanding of café culture, service excellence, and international coffee trends. His time abroad inspired a dream to create a space that combines global standards with a warm, homegrown vibe. HypeBeans Cafe reflects Joseph's commitment to quality, consistency, and creating a place where everyone students, professionals, and families alike can relax, refuel, and feel right at home.
            </p>
          </div>
          <div
            className="h-64 md:h-auto order-1 md:order-2"
            style={{
              backgroundImage: `url(${ABimg2})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}>
          </div>
        </div>
      </div>

      {/* Background */}
      <div className='mt-8 max-w-[95%] mx-auto bg-zinc-700 px-3'>
        <hr className='mb-1'/><hr />
        <div className='grid grid-cols-1 md:grid-cols-[3.5fr_6.5fr] py-5'>
          <div
            className="h-64 md:h-auto"
            style={{
              backgroundImage: `url(${ABimg3})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}>
          </div>
          <div>
            <h2 className='text-2xl md:text-4xl text-zinc-300 font-bold mb-2 text-center'>Background</h2>
            <p className='text-lg md:text-2xl text-zinc-200 font-500 tracking-widest py-4 md:py-8 leading-7 md:leading-10 max-w-[80%] text-justify mx-auto'>
              HypeBeans Cafe was created as a modern café brand that blends quality, affordability, and lifestyle. Designed to serve a wide audience from students and professionals to families it meets the growing demand for flavorful, consistent café offerings in a relaxed, community-focused setting. With accessible pricing, efficient service, and a menu inspired by both global trends and local tastes, HypeBeans aims to become a go-to destination for daily routines and social moments, anchored by a strong brand built on consistency and satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className='mt-8 max-w-[95%] mx-auto'>
        <hr className='mb-1'/><hr />
        <div className='grid grid-cols-1 md:grid-cols-[6.5fr_3.5fr] py-5'>
          <div className="order-2 md:order-1">
            <h2 className='text-2xl md:text-4xl text-zinc-700 font-bold mb-2 text-center'>Mission</h2>
            <p className='text-lg md:text-2xl text-zinc-700 font-500 tracking-widest py-4 md:py-8 leading-7 md:leading-10 max-w-[90%] text-justify mx-auto'>
              At HypeBeans Cafe, our mission is to craft and serve high-quality beverages and snacks that consistently hit the sweet spot every single time. We proudly welcome students, families, professionals, and everyone in between, offering a warm and inviting space where flavor meets familiarity. Through exceptional service and a cozy atmosphere, we aim to energize your day, satisfy your cravings, and create an experience that keeps you coming back.
            </p>
          </div>
          <div
            className="h-64 md:h-auto order-1 md:order-2"
            style={{
              backgroundImage: `url(${ABimg4})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage;