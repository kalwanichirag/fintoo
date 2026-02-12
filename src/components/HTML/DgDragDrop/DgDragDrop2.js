import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { bytesToMegabytes } from '../../../common_utilities';

const DgDragDrop = ({ onFilesSelected }) => {
  const dispatch = useDispatch();
  const resetDragzone = useSelector(state => state.resetDragzone);
  const acceptedFileTypes = [
    'application/pdf'
  ];
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejFiles) => {
    const newFiles = acceptedFiles
      .filter(file => acceptedFileTypes.includes(file.type) && file.size <= 5 * 1024 * 1024) // Check file type and size
      .slice(0, 5 - files.length); // Limit to a maximum of 5 files
    setFiles(prevState => [...prevState, ...newFiles]);
    onFilesSelected(newFiles);
  }, [acceptedFileTypes, files.length, onFilesSelected]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = (event, index) => {
    event.stopPropagation();
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
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
    </div>
  );
};

export default DgDragDrop;