import { useDispatch, useSelector } from "react-redux";
import './spotpage.css'
import PriceButton from "../Main/SpotModal/PriceButton";
import Reviews from "../Reviews/Reviews";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { thunkSpotById } from "../../store/spots";
import OpenModalImage from "./OpenModalImage";
import ImageDisplay from "./ImageDisplay";

import InPageDatePicker from "./InPageDatePicker";


const SpotPage = () => {
    let { id } = useParams();
    const user = useSelector((state) => state.session.user)
    const dispatch = useDispatch();
    useEffect(() => {
        const getSpotDetails = async () => {
            await dispatch(thunkSpotById(id))
        }
        getSpotDetails();
    }, [dispatch, id])

    const spotInfo = useSelector((state) => state?.spots[id]
    )
    if (!spotInfo || (spotInfo && !spotInfo.Owner)) return 'LOADING > > >'
    const owner = spotInfo.Owner
    let ownspot = (user?.id === owner?.id) ? true : false
    const imageCarousel = [{url: spotInfo.previewImage}]
    spotInfo.SpotImages.forEach((image) => imageCarousel.push(image))


    return (
        <div className={'spotPageContainer'}>
            <div className={'topLine'}>
                <h1>{spotInfo.name}</h1>
                <h2>{`${spotInfo.city}, ${spotInfo.state}, ${spotInfo.country}`}</h2>
            </div>
            <div className={'imageDisplayPage'}>
                <OpenModalImage url={spotInfo.previewImage} Class="spotPageImage" modalComponent={<ImageDisplay url={spotInfo.previewImage} spotInfo={spotInfo} imageCarousel={imageCarousel}/>} />
                {spotInfo.SpotImages.map((image) => {
                    return <OpenModalImage key={image.id} url={image.url} Class={'spotPageImage'} modalComponent={<ImageDisplay url={image.url} spotInfo={spotInfo} id={image.id} imageCarousel={imageCarousel}/>} />
                })}
            </div>
            <div className="bioButtonContainer">
                <div className="bio">
                    <h2>{`Hosted by ${owner.firstName} ${owner.lastName}`}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '950px' }}>
                        <p className='bioText'>{spotInfo.description}</p>
                        {!ownspot && <PriceButton spot={{ ...spotInfo }} user={user} style={{ alignSelf: 'center' }} className='priceButtonComponent'/>}
                    </div>
                </div>
            {!ownspot && <InPageDatePicker spotId={spotInfo.id}/>}

            </div>
            <Reviews spot={spotInfo} page={true} />
        </div>
    )
}

export default SpotPage;
