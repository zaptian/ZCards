import NewDesigner from "./NewDesigner";

const Render = () => {
  return (
    <>
      <div className="flex-1 w-full h-full flex flex-col bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border">
        <NewDesigner />
      </div>
    </>
  );
};

export default Render;
