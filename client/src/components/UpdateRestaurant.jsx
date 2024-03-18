import React , { useContext,useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RestaurantsContext } from '../context/RestaurantsContext';
import RestaurantFinder from '../apis/RestaurantFinder';
import { useNavigate } from 'react-router-dom'




const UpdateRestaurant = (props) => {

    const {id} = useParams();
    const{restaurants} = useContext(RestaurantsContext)
    const[name, setName] = useState("");
  const[location, setLocation] = useState("");
  const[priceRange, setPriceRange] = useState("Price Range");
  let history = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            const response = await RestaurantFinder.get(`/${id}`);
            console.log(response.data.data);
            setName(response.data.data.restaurant.name);
            setLocation(response.data.data.restaurant.location);
            setPriceRange(response.data.data.restaurant.price_range);
        
        }

        fetchData();

    }, []);  // this is kept empty

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedRestaurant = await RestaurantFinder.put(`/${id}`, {
          name,
          location,
          price_range: priceRange,
        });
        
        history("/");
    };


     
  return (
    <div>
        <form action="">
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" id="name" />
            </div>

            <div className="form-group">
                <label htmlFor="location">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" className="form-control" id="location" />
            </div>

            <div className="form-group">
                <label htmlFor="price_range">Price Range</label>
                <input value={priceRange} onChange={(e) => setPriceRange(e.target.value)} type="number" className="form-control" id="price_range" />
            </div>

            <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
        </form>
    </div>
  );
}

export default UpdateRestaurant