import { Container } from './styles'
import { Image } from '../../types/Image'

export const ImageItem = ({ url, name }: Image ) => {
    return (
        <Container>
            <img src={url} alt={name} />
            {name}
        </Container>
    )
}