import React from "react";
import ReactDOM from "react-dom";
import ImageUploader from "react-images-upload";
// import { Input } from "antd";

// import "./styles.css";

class PanCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pictures: [] };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles)
    });
  }

  render() {
    return (
        <div
        >
          <div style={{ marginRight: "15px" }}>
          <ImageUploader
              withIcon={false}
              withPreview={true}
              label=""
              buttonText=""
              onChange={this.onDrop}
              imgExtension={[".jpg", ".gif", ".png", ".gif", ".svg"]}
              maxFileSize={1048576}
              fileSizeError=" file size is too big"
            />
          </div>
        </div>
     
    );
  }
}
export default PanCard;

