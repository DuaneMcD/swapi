import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Table.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

export const SwapiTable = () => {
  const [characters, setCharacters] = useState([]);
  const [characterData, setCharacterData] = useState(characters);
  const apiURL = `https://swapi.dev/api/`;

  useEffect(() => {
    const fetchCharacters = async () => {
      for (let i = 1; i < 10; i++) {
        let response = await Axios(`${apiURL}people/?page=${i}`);
        let cleanData = response.data.results.map(async character => {
          return {
            ...character,
            height: handleHeight(character.height),
            mass: handleMass(character.mass),
            birth_year: handleBirthYear(character.birth_year),
            gender: handleGender(character.gender),
            homeworld: await handleEndpoints(character.homeworld),
            species: handleSpecies(await handleEndpoints(character.species)),
          };
        });

        Promise.all(cleanData).then(result =>
          setCharacters(characters => characters.concat(result))
        );
      }
    };
    fetchCharacters();
  }, []);

  useEffect(() => {
    setCharacterData(characters);
  }, [characters]);

  const handleGender = person => {
    switch (person) {
      case 'male':
        return 'Male';
      case 'female':
        return 'Female';
      case 'none':
      case 'n/a':
        return 'Droid';
      case 'hermaphrodite':
        return 'Hermaphrodite';
      default:
        return person.gender;
    }
  };

  const handleEndpoints = async props => {
    let result = await Axios.get(`${props}`);
    return Promise.resolve(result.data.name);
  };
  const handleSpecies = specie => {
    switch (specie) {
      case undefined:
        return 'Human';
      default:
        return specie;
    }
  };
  const handleHeight = height => {
    switch (height) {
      case 'unknown':
        return 'No Record';
      default:
        return `${height}cm`;
    }
  };
  const handleMass = mass => {
    switch (mass) {
      case 'unknown':
        return 'No Record';
      default:
        return `${mass}kg`;
    }
  };
  const handleBirthYear = year => {
    switch (year) {
      case 'unknown':
        return 'No Record';
      default:
        return `${year}`;
    }
  };

  const columns = [
    { dataField: 'name', text: 'Name', sort: true },
    { dataField: 'gender', text: 'Gender', sort: true },
    { dataField: 'species', text: 'Species', sort: true },
    { dataField: 'homeworld', text: 'Homeworld', sort: true },
    { dataField: 'birth_year', text: 'Birth Year', sort: true },
    { dataField: 'height', text: 'Height', sort: true },
    { dataField: 'mass', text: 'Mass', sort: true },
  ];

  const defaultSorted = [
    {
      dataField: 'name',
      order: 'asc',
    },
  ];

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
    lastPageText: '>>',
    firstPageText: '<<',
    nextPageText: '>',
    prePageText: '<',
    showTotal: true,
    alwaysShowAllBtns: false,
  });

  const { SearchBar, ClearSearchButton } = Search;

  return (
    <ToolkitProvider
      bootstrap4
      keyField='name'
      data={characterData}
      columns={columns}
      search>
      {props => (
        <div>
          <SearchBar placeholder='Force Seach...' {...props.searchProps} />
          <ClearSearchButton {...props.searchProps} />
          <BootstrapTable
            rowClasses='custom-row-class'
            defaultSorted={defaultSorted}
            pagination={pagination}
            {...props.baseProps}
          />
        </div>
      )}
    </ToolkitProvider>
  );
};

export default SwapiTable;
