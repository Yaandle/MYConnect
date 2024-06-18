import Image from "next/image";
import { CardBody, CardContainer, CardItem } from '@/components/global/3d-card'
import { LampComponent } from '@/components/global/lamp'
import { CheckIcon } from 'lucide-react'
import Navbar from '@/components/global/navbar'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Navbar />
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <section className="mt-[-10px]">
          <LampComponent />
          <div className="flex justify-center items-center space-x-4">
            <CardContainer className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full md:w-[350px] h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  Software Optimization
                  <h2 className="text-6xl">$500</h2>
                </CardItem>
                <CardItem
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  Experience the power of our software optimization solutions and unlock
                  unprecedented efficiency in your operations.
                  <ul className="my-4 flex flex-col gap-2">
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Automated software analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Tailored optimization strategies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Continuous performance monitoring
                    </li>
                  </ul>
                </CardItem>
                <div className="flex justify-between items-center mt-8">
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  >
                    Try now →
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Get Started Now
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>

            <CardContainer className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-[#E2CBFF] border-black/[0.1] w-full md:w-[350px] h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  Business Support
                  <h2 className="text-6xl">$300</h2>
                </CardItem>
                <CardItem
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                   Empower your business with our comprehensive support solutions designed to improve efficiency and productivity.
                  <ul className="my-4 flex flex-col gap-2">
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Professional consulting and strategy planning
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Customized business process optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Continuous support and performance monitoring
                    </li>
                  </ul>
                </CardItem>
                <div className="flex justify-between items-center mt-8">
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  >
                    Try now →
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Get Started Now
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>

            <CardContainer className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full md:w-[350px] h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  Robotics Automation
                  <h2 className="text-6xl">$3000</h2>
                </CardItem>
                <CardItem
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  Automate your workflow and optimize productivity with our robotics
                  automation solutions tailored to your business needs.
                  <ul className="my-4 flex flex-col gap-2">
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Workflow analysis and optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Robotics integration and deployment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Training and support for robotics implementation
                    </li>
                  </ul>
                </CardItem>
                <div className="flex justify-between items-center mt-8">
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  >
                    Try now →
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Get Started Now
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          </div>
        </section>
      </div>
    </main>
  );
}
