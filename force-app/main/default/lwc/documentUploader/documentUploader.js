import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import forcetk from '@salesforce/resourceUrl/forcetk';
import jquery from '@salesforce/resourceUrl/jquery';

export default class DocumentUploader extends LightningElement {
    @api isLoaded = false;
//    handleFilesChange(event) {
//        console.log('in handleFilesChange');
//        const file = event.target.files[0];
//        console.log(file);
//        console.log(sessionStorage.length);
//
//        Promise.all([
//                    loadScript(this, jquery),
//                    loadScript(this, forcetk)
//                ])
//                    .then(() => {
//                        console.log('Loaded ' + forcetk);
//                        let client = new this.Client();
//                        this.setSessionToken('11111');
////                        console.log(forcetk);
//                    })
//                    .catch(error => {
//                        console.log(error.message);
//                    });
//    }

    toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let result = reader.result;
            let base64 = 'base64,';
            let content = result.indexOf(base64) + base64.length;
            let fileContents = result.substring(content);
            resolve(fileContents);
        }
        reader.onerror = error => reject(error);
    });

    async handleFilesChange(event){
        if (event.target.files.length > 0) {
            this.file = {
                parentRec : this.recordid,
                fileName : event.target.files[0].name,
                fileContent : await this.toBase64(event.target.files[0])
            }
        }
    }

    fireToVF(){
        this.fireToComponent(this.file);
    }

    fireToComponent(message){
        this.isLoaded = !this.isLoaded;
        this.template.querySelector('iframe').contentWindow.postMessage(message, '*');
    }

    connectedCallback() {
        this.isLoaded = !this.isLoaded;
        window.addEventListener('message', (message)=>{
                    console.log(message.data);
                    this.isLoaded = !this.isLoaded;
                });
    }
}