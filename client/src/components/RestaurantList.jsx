import React, {useContext, useEffect} from 'react'
import RestaurantFinder from '../apis/RestaurantFinder'
import { RestaurantsContext } from '../context/RestaurantsContext'
import { useNavigate } from 'react-router-dom'
import StarRating from "./StarRating"

const RestaurantList = (props) => {

    const{restaurants, setRestaurants} = useContext(RestaurantsContext)

    let history = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            try {
              const response = await RestaurantFinder.get("/");
              console.log(response);
              setRestaurants(response.data.data.restaurant);
            } catch (err) {
              console.log(err);
            }
        }

        fetchData();

    }, [])  // we pass an empty dependency array because useeffect will only run when the component mounts. If its not used, it will run every time when the component re-renders also, which results in a loop  
    
    const handleDelete = async (e, id) => {

        e.stopPropagation();
        try{
           const response = await RestaurantFinder.delete(`/${id}`);
           console.log(response);
           setRestaurants(restaurants.filter(restaurant => {
            return restaurant.id !== id
           }))
        } catch(err){
            console.log(err);
        }
    }

    const handleUpdate = (e, id) => {
        e.stopPropagation();
        history(`/restaurants/${id}/update`);
    };

    const handleRestaurantSelect = (id) => {
        history(`/restaurants/${id}`);
    };

    const renderRating = (restaurant) => {
        if (!restaurant.count) {
          return <span className="text-warning">0 reviews</span>;
        }
        return (
          <>
            <StarRating rating={restaurant.id} />
            <span className="text-warning ml-1">({restaurant.count})</span>
          </>
        );
    };





  return (
    <div className='list-group'>
        <table className="table table-hover table-dark">
            <thead>
                <tr>
                    <th scope='col'>Restaurant</th>
                    <th scope='col'>Location</th>
                    <th scope='col'>Price Range</th>
                    <th scope='col'>Ratings</th>
                    <th scope='col'>Edit</th>
                    <th scope='col'>Delete</th>
                </tr>
            </thead>
            <tbody>
                {restaurants && restaurants.map((restaurant) => {
                    return (
                        <tr onClick={() => handleRestaurantSelect(restaurant.id)} key={restaurant.id}>
                            <td>{restaurant.name}</td>
                            <td>{restaurant.location}</td>
                            <td>{"$".repeat(restaurant.price_range)}</td>
                            <td>{renderRating(restaurant)}</td>
                            <td><button onClick={(e) => handleUpdate(e, restaurant.id)} className="btn btn-warning">Update</button></td>
                            <td><button onClick={(e) => handleDelete(e, restaurant.id)} className="btn btn-danger">Delete</button></td>
                        </tr>
                    );
                })}
                {/* { <tr>
                    <td>mcdonalds</td>
                    <td>Sikar</td>
                    <td>3</td>
                    <td>Rating</td>
                    <td><button className="btn btn-warning">Update</button></td>
                    <td><button className="btn btn-danger">Delete</button></td>
                </tr> } */}
            </tbody>
        </table>
    </div>
  )
}

export default RestaurantList;