import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MapWithPinInput } from '../../components/Map/Map';
import { locations } from '../../lib/LocationData';
import UploadWidget from "../../components/UploadWidget/UploadWidget"
import apiReq from "../../lib/apiReq"
import { useNavigate } from 'react-router-dom';

export const IncidentReportPage = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [value, setValue] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  // Handle province change
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict('');
    setSelectedCity('');
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedCity('');
  };

  // Handle city change
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  // Get districts and cities based on selected province and district
  const availableDistricts =
    locations.provinces.find((prov) => prov.name === selectedProvince)
      ?.districts || [];
  const availableCities =
    availableDistricts.find((dist) => dist.name === selectedDistrict)?.cities ||
    [];

  const handlePinChange = (latitude, longitude) => {
    setLat(latitude);
    setLng(longitude);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    console.log(inputs)

    try {
      const res = await apiReq.post('/incidents', {
        incidentData: {
          type: selectedType,
          title: inputs.title,
          description: value,
          province: inputs.province,
          district: inputs.district,
          city: inputs.city,
          latitude: lat.toString(),
          longitude: lng.toString(),
          images: images,
        },
        incidentDetail: {
          deaths: parseInt(inputs.deaths),
          casualities: parseInt(inputs.casualities),
        },
      });
      navigate("/"+res.data.id)

    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div className="IncidentReportPage">
      <div className="formContainer scrollbar">
        <h1>Report New Incident</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="input-multi-custom">
              <div className="input-single">
                <label htmlFor="type">Disater Type</label>
                <select
                  name="type"
                  value={selectedType}
                  onChange={handleTypeChange}
                >
                  <option value="Flood">Flood</option>
                  <option value="Fire">Fire</option>
                  <option value="Cyclone">Cyclone</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Tsunami">Tsunami</option>
                  <option value="Earthquake">Earthquake</option>
                </select>
              </div>
              <div className="input-single">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" type="text" />
              </div>
            </div>

            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onchange={setValue} value={value} />
            </div>

            <div className="input-multi">
              <div className="input-single">
                <label htmlFor="province">Province</label>
                <select
                  name="province"
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                >
                  <option value="">Select Province</option>
                  {locations.provinces.map((province) => (
                    <option key={province.name} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-single">
                <label htmlFor="district">District</label>
                <select
                  name="district"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  disabled={!selectedProvince}
                >
                  <option value="">Select District</option>
                  {availableDistricts.map((district) => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-single">
                <label htmlFor="city">City</label>
                <select
                  name="city"
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedDistrict}
                >
                  <option value="">Select City</option>
                  {availableCities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-single">
              <label htmlFor="location">Map Location</label>
              <MapWithPinInput
                onPinChange={handlePinChange}
                height={'400px'}
                width={'100%'}
              />
            </div>

            <div className="input-multi">
              <div className="input-single">
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  name="latitude"
                  type="text"
                  step="any"
                  value={lat}
                  readOnly
                />
              </div>
              <div className="input-single">
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  name="longitude"
                  type="text"
                  step="any"
                  value={lng}
                  readOnly
                />
              </div>
            </div>

            <div className="input-multi">
              <div className="input-single">
                <label htmlFor="deaths">Deaths</label>
                <input min={0} id="deaths" name="deaths" type="number" />
              </div>
              <div className="input-single">
                <label htmlFor="casualities">Casualties</label>
                <input
                  min={0}
                  id="casualities"
                  name="casualities"
                  type="number"
                />
              </div>
            </div>
            <div className="btn-sec">
              <button className="sendButton">Report</button>
            </div>
          </form>
        </div>
      </div>
      <div className="sideContainer">
        <div className="images">
          {images.map((image, index) => (
            <img src={image} key={index} alt="disaster-images" />
          ))}
        </div>

        <UploadWidget
          uwConfig={{
            cloudName: 'WarmHands',
            uploadPreset: 'WarmHands',
            multiple: true,
            folder: 'incidents',
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
};
