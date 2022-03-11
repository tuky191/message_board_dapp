import React from 'react'
import ReactQuill, { Quill } from 'react-quill';
import EmbedBlot from 'quill';
import ImageResize from "quill-image-resize-module--fix-imports-error";
import { ImageDrop } from 'quill-image-drop-module';
import 'react-quill/dist/quill.snow.css'
import { IPFS } from "./IPFS";

let BlockEmbed = Quill.import('blots/block/embed');
class ImageBlot extends BlockEmbed {
    static create(value) {
        console.log(value)
        let node = super.create();
        node.setAttribute('alt', value.alt);
        node.setAttribute('src', value.url);
        node.setAttribute('class', "img-fluid");
        return node;
    }

    static value(node) {
        return {
            alt: node.getAttribute('alt'),
            url: node.getAttribute('src')
        };
    }
}

ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';

Quill.register("modules/imageResize", ImageResize);
//Quill.register('modules/imageDrop', ImageDrop);
Quill.register(ImageBlot);

const toolbarContainer = [
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'font': [] }],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'align': [] }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    ['blockquote', 'code-block'],

    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['emoji', 'image', 'video', 'link'],

    ['clean']
]
const uploadFile = IPFS();


class MyCustomQuill extends React.Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = { text: this.props.text || ' ', setText: this.props.setText} // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {
        this.setState({ text: value })
        this.state.setText(this.state.text)
        console.log(this.state)
    }

    imageHandler = (image, callback) => {
        this.quillEditor = this.quillRef.getEditor()
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = async () => {
            const file = input.files[0]
            const res = await uploadFile(file)
            let url = 'https://ipfs.io/ipfs/' + res
            console.log(res)
            const range = this.quillEditor.getSelection()
            let value = {url: url,
                        alt: url}
            this.quillEditor.insertEmbed(range.index, 'image', value, "user")
        }
    }
    modules = {
        toolbar: {
            container: toolbarContainer,
            handlers: {image: this.imageHandler}
        },
     //   imageDrop: true,
        imageResize: { parchment: Quill.import('parchment')}
    }

    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    render() {
        return (
            <ReactQuill 
                ref={ref => this.quillRef = ref}    
                theme="snow" 
                value={this.state.text} 
                modules={this.modules}
                formats={this.formats}
                onChange={this.handleChange}
                />
        )
    }
}
export default MyCustomQuill;