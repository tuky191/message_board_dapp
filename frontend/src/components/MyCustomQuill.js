import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { IPFS } from "./IPFS";

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

    imageHandler = () => {
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
            console.log(url)
            // this part the image is inserted
            // by 'image' option below, you just have to put src(link) of img here. 
            this.quillEditor.insertEmbed(range.index, 'image', url)
        }
    }
    modules = {
        toolbar: {
            container: toolbarContainer,
            handlers: {image: this.imageHandler}
        } 
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