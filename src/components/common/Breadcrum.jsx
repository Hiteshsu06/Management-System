import { useNavigate } from "react-router-dom";

const Breadcrum = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between text-TextSecondaryColor">
      <div className="text-sm">{item?.heading}</div>
      <div className="flex text-xs">
        {item?.routes?.map((element, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                navigate(`${element?.route}`);
              }}
            >
              <span>{element?.label}</span>
              <span>
                {index !== item?.routes?.length - 1 ? (
                  <span className="mx-2">&gt;</span>
                ) : (
                  ""
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrum;
