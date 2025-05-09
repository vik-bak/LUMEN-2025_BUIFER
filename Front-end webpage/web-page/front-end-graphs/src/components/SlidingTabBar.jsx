import { useState, useRef, useEffect } from "react";

const allTabs = [
  { id: "home", name: "Tepmerature" },
  { id: "blog", name: "Humidity" },
  { id: "projects", name: "Pressure" },
  { id: "arts", name: "Wind Speed" },
];

const SlidingTabBar = () => {
  const tabsRef = useRef([]);
  const [activeTabIndex, setActiveTabIndex] = useState(null);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  useEffect(() => {
    if (activeTabIndex === null) return;

    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeTabIndex];
      if (currentTab) {
        setTabUnderlineLeft(currentTab.offsetLeft);
        setTabUnderlineWidth(currentTab.clientWidth);
      }
    };

    setTabPosition();
  }, [activeTabIndex]);

  return (
    <div className="flex justify-center">
      <div className="relative inline-flex h-12 rounded-3xl border border-black/40 bg-neutral-800 px-2 backdrop-blur-sm w-fit">
        {/* Moving background for active tab */}
        <span
          className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-2 transition-all duration-300"
          style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
        >
          <span className="h-full w-full rounded-3xl bg-gray-200/30" />
        </span>

        {allTabs.map((tab, index) => {
          const isActive = activeTabIndex === index;

          return (
            <button
              key={index}
              ref={(el) => (tabsRef.current[index] = el)}
              className={`${
                isActive ? "" : "hover:text-red-300"
              } my-auto cursor-pointer select-none rounded-full px-4 text-center font-light text-white`}
              onClick={() => setActiveTabIndex(index)}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SlidingTabBar;
