import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { bytesToMegabytes } from '../../../common_utilities';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DgDragDrop = ({ onFilesSelected }) => {
  const dispatch = useDispatch();
  const resetDragzone = useSelector(state => state.resetDragzone);
  const acceptedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/tiff',
  ];
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 5 - files.length) {
      toast.error('Only 5 files can be uploaded at a time.', {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 3000,
      });
      acceptedFiles = acceptedFiles.slice(0, 5 - files.length);
    }
  
    const newFiles = acceptedFiles.filter(
      file => acceptedFileTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
    );
  
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);   // ✅ send full list to parent
  }, [acceptedFileTypes, files, onFilesSelected]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = (event, index) => {
    event.stopPropagation();
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);   // ✅ sync with parent
  };

  useEffect(() => {
    if (resetDragzone) {
      setFiles([]);
      dispatch({ type: 'RESET_DRAGZONE', payload: false });
    }
  }, [resetDragzone]);

  return (
    <div className='position-relative'>
      <div {...getRootProps()} className='dropzone dz-clickable'>
        <input {...getInputProps()} />
        <div className='dz-default dz-message'>
          {files.length === 0 && <div style={{ textAlign: 'center !important' }}>Drop Files Here To Upload*</div>}
        </div>
      </div>
     
      {files.length > 0 && (
        <div className='d-flex Documentlistarea'>
          {files.map((file, index) => (
            <div className='FileArea' key={index}>
              <div>
                {file.type.includes('image') ? (
                  <div title={file.name}>{bytesToMegabytes(file.size)} MB</div>
                ) : (
                  <div title={file.name}>{bytesToMegabytes(file.size)} MB</div>
                )}
                <div
                  style={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    color: 'black',
                  }}
                  onClick={event => removeFile(event, index)}
                >
                  Remove
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
       <ToastContainer />
    </div>
  );
};

export default DgDragDrop;
