import CustomButton from "../CustomButton";

export default function Hero() {
  return (
    <section className="relative w-full">
      <img
        src="/images/hero-img-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <div className="relative z-10 px-6 py-24 text-white w-[90%]">
        <h1 className="text-4xl md:text-6xl font-bold sm:flex sm:flex-col">
          Build your career. <span>Find your next opportunity.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/90">
          Discover developer jobs from companies that are looking for people
          like you. Search by role, location, experience, and skills to find
          opportunities that match where you want to go next.
        </p>
         <div className="flex justify-end-safe gap-4 p-4 ">
        <CustomButton link="" text="Explore Jobs"/>
        <CustomButton link="" text="Post a Job"/>
      </div>
      </div>
     
    </section>
  );
}
