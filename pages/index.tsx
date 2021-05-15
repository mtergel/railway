import { useTheme } from "next-themes";

const colors = [
  {
    label: "Red",
    value: "red",
  },
  {
    label: "Yellow",
    value: "yellow",
  },
  {
    label: "Green",
    value: "green",
  },
  {
    label: "Indigo",
    value: "indigo",
  },
  {
    label: "Purple",
    value: "purple",
  },
  {
    label: "Pink",
    value: "pink",
  },
];

const Home = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          theme === "light" ? setTheme("dark") : setTheme("light")
        }
      >
        Toggle theme
      </button>
      <div className="p-3 font-bold">Selected Color:</div>
      <div className="my-2 px-3 flex flex-wrap space-x-3">
        {colors.map((i) => (
          <button
            className={`w-4 h-4 rounded-full bg-${i.value}-400 dark:bg-${i.value}-300`}
            key={i.label}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Home;
