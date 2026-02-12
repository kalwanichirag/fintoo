import { useEffect, useState, useRef } from "react";
import style from '../../Pages/style.module.css';
import axios from "axios";

  import { getUserId } from "../../common_utilities";
import ReactSimpleSelect from "../ReactSimpleSelect";
function Itruploaddoc() {
    const [file, setFile] = useState(null);
    const [Documents, setDocumentData] = useState([]);
    const [UploadedDocuments, setUploadedDocuments] = useState([]);
    const [doctype, setdoctype] = useState("");
    const inputRef = useRef(null);

    const handleClick = () => {
      inputRef.current.click();
    };
  
    const handleFileChange = (event) => {
      const fileObj = event.target.files && event.target.files[0];
      if (!fileObj) {
        return;
      }
      event.target.value = null;
    };
    // useEffect(() => {
    //   // fetchDocuments();
    //   // fetchUploadedDocuments();
    // }, []);
  
    // const fetchDocuments = async () => {
    //   var res = await axios.post(TAX_GET_DOCUMENTS_API_URL, {});
    //   const index_data = res.data.data;
    //   setDocumentData(index_data);
    // };
  
    // const fetchUploadedDocuments = async () => {
    //   const user_id = getUserId();
    //   var res = await axios.post(TAX_GET_UPLOADED_DOCUMENTS_API_URL, {
    //     user_id: user_id,
    //   });
    //   const doc_data = res.data.data;
    //   setUploadedDocuments(doc_data);
    // };
  
    
  
    const options = [
      { value: 1, title: "Form 16 - PART A" },
      { value: 2, title: "Form 16 - PART B" },
      { value: 3, title: "Form 16 - (PART A & B)" },
      { value: 4, title: "PAN" },
      { value: 5, title: "For HRA, Rent Agreement" },
    ];
  return (
    <div>
  <table className="table">
                  <thead>
                    <tr>
                      <th>File Type</th>
                      <th>Status</th>
                      <th style={{ width: 40 }}>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {UploadedDocuments.map((v)=> (
                     */}

                    <tr className={style.trField}>
                      <td>
                        <ReactSimpleSelect
                          options={options}
                          value=""
                          // options={Documents.map((v)=> {
                          //   return {title: v.dt_name, value: v.dt_id};
                          // })}
                          // value={v.doc_type}
                        />
                      </td>
                      <td>
                        <div className={`${style.buttonChoose} d-inline-flex`}>
                          <div className={style.imagebox}>
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/static/media/ITR/up-loading_3.png"
                              }
                            />
                          </div>
                          <input
                            style={{ display: "none" }}
                            ref={inputRef}
                            type="file"
                            onChange={handleFileChange}
                          />
                          <label
                            onClick={handleClick}
                            className={`pointer ${style.chooseText}`}
                          >
                            Choose File
                          </label>
                          {/* <label onClick={handleClick}>Open file upload box</label> */}
                          {/* <input type="file" hidden id="file" className={`${style.CustomFile}`}   />
                          <label htmlfor="file" className={`pointer ${style.chooseText}`}>Choose File</label> */}
                        </div>
                      </td>
                      <td>
                        <div>
                          <i className="fa fa-trash" aria-hidden="true"></i>
                        </div>
                      </td>
                    </tr>

                    {/* ))} */}
                  </tbody>
                </table>
    </div>
  )
}

export default Itruploaddoc