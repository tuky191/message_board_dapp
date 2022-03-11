import React from 'react'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import { GiphyFetch } from "@giphy/js-fetch-api";
import {
    Gif,
    Grid
} from "@giphy/react-components";

const Giphy = () => {

    const giphyFetch = new GiphyFetch("uKkkU2hZY1vxUKzXbEE17z64bJ2kXSUb");

    const GridDemo = ({ onGifClick }) => {
        const fetchGifs = (offset) =>
            giphyFetch.trending({ offset, limit: 10 });
        const [width, setWidth] = useState(window.innerWidth);
        return (
            <>
                <Grid
                    onGifClick={onGifClick}
                    fetchGifs={fetchGifs}
                    width={width}
                    columns={3}
                    gutter={6}
                />
                <ResizeObserver
                    onResize={({ width }) => {
                        setWidth(width);
                    }}
                />
            </>
        );
    }
    const [modalGif, setModalGif] = useState();
    const handleChangeSubject = e => {
        setSubject(e.target.value)
    };

    return <div>
        <GridDemo
            onGifClick={(gif, e) => {
                console.log("gif", gif);
                e.preventDefault();
                setModalGif(gif);
            }}
        />
        {modalGif && (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(0, 0, 0, .8)"
                }}
                onClick={(e) => {
                    e.preventDefault();
                    setModalGif(undefined);
                }}
            >
                <Gif gif={modalGif} width={200} />
            </div>
        )}
        <Form>
            <div className="modal-body">
                <div className="form-group">
                    <label>How do you call yourself:</label>
                    <Form.Item> <Input onChange={handleChangeSubject} /></Form.Item>
                </div>
                <div className="form-group">
                    <label>Profile Pic:</label>
                    <Form.Item><button onClick={GridDemo} /></Form.Item>
                </div>
                <div className="form-group">
                    <div className="custom-file form-control-sm mt-3" >
                        <input type="file" className="custom-file-input" id="customFile" multiple="" />
                        <label className="custom-file-label" htmlFor="customFile">Attachment</label>
                    </div>
                </div>
            </div>
        </Form>
    </div>
}

export default Giphy