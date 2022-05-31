import { Image } from "../types/Image"
import { storage } from '../libs/firebase'
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage'
import { v4 as createID } from 'uuid'

export const getAll = async () => {
    let list: Image[] = [];

    const imagesFolfer = ref( storage, "images" );
    const imageList = await listAll( imagesFolfer );

    for(let i in imageList.items){
        let imageUrl = await getDownloadURL(imageList.items[i])

        list.push({
            name: imageList.items[i].name,
            url: imageUrl
        })
    }

    return list
}


export const insert = async (file: File) => {
    if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)){
        let randomName = createID();
        let newFile = ref(storage, `images/${randomName}`);
        let upload = await uploadBytes(newFile, file);
        let imageUrl = await getDownloadURL(upload.ref)

        return {
            name: upload.ref.name,
            url: imageUrl
        } as Image
    } else {
        return new Error('Tipo de arquivo não permitido!')
    }
}