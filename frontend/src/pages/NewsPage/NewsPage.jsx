import { useEffect, useState } from 'react';
import axios from 'axios';
import { Filter } from '../../components/Filter/Filter';
import { Card } from '../../components/Card/Card';
import { Map } from '../../components/Map/Map';

export const NewsPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    disasterType: 'all',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/incidents');
        setData(response.data);
        setFilteredData(response.data); // Initially set filteredData to all incidents
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      let filtered = data;

      if (filters.location) {
        filtered = filtered.filter((item) =>
          item.city.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.disasterType !== 'all') {
        filtered = filtered.filter(
          (item) =>
            item.type.toLowerCase() === filters.disasterType.toLowerCase()
        );
      }

      setFilteredData(filtered);
    };

    filterData();
  }, [filters, data]);

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <div className="newsPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter onFilterChange={handleFilterChange} />
          {filteredData.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className="mapContainer">
        <Map
          items={filteredData}
          zoom={8}
          latitude={7.847}
          longitude={80.758}
        />
      </div>
    </div>
  );
};
