import React from 'react'
import { FaGithub } from 'react-icons/fa'

function Page() {
  return (
    <div className="mx-auto w-screen-2xl bg-gradient-to-t from-slate-100 via-whiten to-white dark:bg-black dark:from-transparent dark:to-transparent dark:via-transparent p-4 md:p-6 2xl:p-10 h-screen sm:mb-8 text-black dark:text-current hide-scrollbar overflow-scroll 2xl:px-40 ">
      <div className='w-full flex items-center flex-col h-[70%] sm:h-auto overflow-y-scroll sm:hide-scrollbar '>
      <h1 className="text-4xl font-bold mb-8 text-center">About This Project</h1>
      <div className='xl:w-[80%] flex flex-col items-center '>
      <p className="text-lg mb-6">
        Welcome to the all-encompassing life organizer, designed to seamlessly integrate multiple facets of your daily existence. Life is multifaceted, and so should be the tools that help us navigate it. This platform is meticulously crafted to not just track hobbies, but to bring order and clarity to daily tasks, upcoming events, notes, schedules, and more.
      </p>
      <p className="text-lg mb-6">
        Dive deep into the intuitive calendar, a central hub where you can plan, track, and manage every event, task, or hobby. Beyond mere tracking, the application provides in-depth management tools, allowing you to engage with each item, understanding its nuances and making informed decisions.
      </p>
      <p className="text-lg mb-6">
        At its core, this platform is about progress. Whether you're refining a hobby, ticking off tasks, or preparing for an upcoming event, this application presents smart metrics and feedback. Reflect on your journey through the dashboard, a dynamic space offering insightful summaries and illuminating your achievements.
      </p>
      <p className="text-lg mb-6">
        In essence, this application is more than just a tool—it's your companion in weaving the narrative of your life, ensuring every chapter is organized, understood, and celebrated. Let's journey together, making every day count.
      </p>
      </div>
      </div>
      <div className="flex flex-col items-center mt-10">
        <a href="https://github.com/Jaron15" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-highlight">
          <FaGithub size={32} className="mr-2" />
          <span>View my GitHub for more of my work</span>
        </a>
      </div>
    </div>
  )
}

export default Page;
