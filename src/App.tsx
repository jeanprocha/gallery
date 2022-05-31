import { Container, Area, Header, ScreenWarning, ImageList, UploadForm } from './App.styles'
import * as Images from './services/images'
import { Image } from './types/Image'
import { ImageItem } from './components/ImageItem'

import { useState, useEffect, FormEvent } from 'react'

const App = () => {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const getImages = async () => {
      setLoading(true)

      setImages(await Images.getAll())

      setLoading(false)
    }

    getImages()
  }, [])

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget)
    const file = formData.get('image') as File;

    if(file && file.size > 0){
      setUploading(true)
      let result = await Images.insert(file)
      setUploading(false)

      if(result instanceof Error){
        alert(`${result.name} - ${result.message}`)
      } else {
        let newImageslist = [...images];
        newImageslist.push(result);
        setImages(newImageslist)
      }
    }
  }

  return (
    <Container>
      <Area>
        <Header>Galeria de Fotos</Header>

        <UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />
          { uploading && "Enviando..." }
        </UploadForm>

        {loading &&
          <ScreenWarning>
            <div>Carregando...</div>
          </ScreenWarning>
        }

        {!loading && images.length > 0 &&
          <ImageList>
            {images.map((item, index) => (
              <ImageItem key={index} url={item.url} name={item.name} />
            ))}
          </ImageList>
        }

        {!loading && images.length == 0 &&
          <ScreenWarning>
            <div>Não há imagens cadastradas!</div>
          </ScreenWarning>
        }
      </Area>
    </Container>
  )
}

export default App;