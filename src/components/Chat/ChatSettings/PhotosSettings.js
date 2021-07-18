import React, { useState } from "react";
import Thumbnail from "../Thumbnail";
import { LeftOutlined, DownOutlined } from "@ant-design/icons";

const PhotosSettings = (props) => {
    const [state, setState] = useState({
        collapsed: true,
        hovered: false,
        errorMessage: ""
    });
    const { chat } = props;


    function renderPhotos(attachments) {
        return attachments.map((attachment, index) => {
            return <Thumbnail key={`person_${index}`} attachment={attachment} />;
        });
    }

    return (
        <div
            style={{ borderTop: "1px solid #f0f0f0" }}
            className="ce-photo-section"
        >
            <div
                onMouseEnter={() => setState({ ...state, hovered: true })}
                onMouseLeave={() => setState({ ...state, hovered: false })}
                onClick={() => setState({ ...state, collapsed: !state.collapsed })}
                style={
                    state.hovered ? {

                        cursor: "pointer"
                     

                    } : {}
                }
                className="ce-section-title-container ce-photo-title-container"
            >
                <div
                    className="ce-section-title ce-photo-title"
                    style={{
                        fontSize: "16px",
                        padding: "12px 12px 12px 0px",
                        fontWeight: "400",
                        fontFamily: "Quicksand",
                        letterSpacing: "1px",
                        fontWeight: "400",
                        color: "rgba(255, 255, 255, 0.7)"
                    }}
                >
                    Gallery
                </div>

                {state.collapsed ? (
                    <LeftOutlined style={styles.collapseIcon} />
                ) : (
                    <DownOutlined style={styles.collapseIcon} />
                )}
            </div>


            {!state.collapsed && (
                <div className="ce-photo-feed">
                    <div style={{ height: "12px" }} />

                    {(chat.attachments.length > 0) ?
                        renderPhotos(chat.attachments)
                        :
                        <div className="gallery-error"> Nothing here yet</div>
                    }
                </div>
            )}
        </div>
    );
};

export default PhotosSettings;

const styles = {
    collapseIcon: {
        float: "right",
        position: "relative",
        bottom: "30px",
        right: "12px",
    },
};
