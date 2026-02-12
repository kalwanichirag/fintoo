import { useState, useRef, useEffect } from "react";
import { HiSortAscending } from "react-icons/hi";

const FintooDropdown = (props) => {
  const [sort, setSort] = useState("Sort");
  const [openSort, setOpenSort] = useState(false);
  const refDropdown = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (refDropdown.current && !refDropdown.current.contains(event.target)) {
        setOpenSort(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (sort) {
      props.onChange(sort);
    }
  }, [sort]);



  return (
    <>
      <div
        ref={refDropdown}
        onClick={() => setOpenSort((v) => !v)}
        className="resultOptionsBtn position-relative hover-dropdown pointer"
      >
        <HiSortAscending fontSize={"1.2rem"} />
        <span>{sort}</span>

        {openSort == true && (
          <div className="download-report-box hover-dropdown-box">
            <div className="hover-dropdown-content">
              <div className="custom-dropdown-9 ">
                {
                  props.sortOptions.map((v, key) => <div key={key} onClick={() => setSort(v)}>
                    {v}
                  </div>)
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default FintooDropdown;
