import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { FileUpload } from "react-ipfs-uploader";
import { create } from 'ipfs-http-client'
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
const client = create('https://ipfs.infura.io:5001/api/v0')


const uploadFile = async({ image, callback }) => {

    const { cid } = await client.add(image)
    
    console.log(cid);
    var data = new FormData();
    data.append('image', image);



/*    let response = await client.upload({
        image: 'https://www.rouming.cz/upload/ticha_dohoda.jpg',
        title: 'Meme',
        description: 'Dank Meme',
    });
    console.log(response.data);
*/
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.imgur.com/3/image', true);
    xhr.setRequestHeader('Authorization', 'Client-ID ' + 'b01105111941579d3a4fd011d4a103b63e7d6484');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var response = JSON.parse(xhr.responseText);
            if (response.status === 200 && response.success) {
                console.log(response.data.link);
                callback(response.data.link);
            } else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    callback(e.target.result);
                };
                reader.readAsDataURL(data.image);
            }
        }
    }
    console.log(xhr);
    xhr.send(data);
    
}



class MyCustomQuill extends React.Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = { text: this.props.text || ' ', setText: this.props.setText} // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {
        this.setState({ text: value })
        this.state.setText({ text: this.state.text })
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
            console.log(input)
            console.log(file)
            //const test = await fetchAnswer(file)
            const res = await uploadFile(file)
            const range = this.quillEditor.getSelection()
            const link = res.data[0].url

            // this part the image is inserted
            // by 'image' option below, you just have to put src(link) of img here. 
            this.quillEditor.insertEmbed(range.index, 'image', link)
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