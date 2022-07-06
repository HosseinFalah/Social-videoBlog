import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "./TextEditor.css";

const TextEditor = ({getDescriptionValue}) =>  {
    return (
        <CKEditor
            className="ck-editor cke_editable"
            editor={ ClassicEditor }
            apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
            data=""
            onChange={getDescriptionValue}
        />
    );
}

export default TextEditor;
