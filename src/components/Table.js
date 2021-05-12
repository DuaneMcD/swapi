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
            height: sanitize(character.height, 'cm'),
            mass: sanitize(character.mass, 'kg'),
            birth_year: sanitize(character.birth_year),
            gender: handleGender(character.gender),
            homeworld: sanitize(await handleEndpoints(character.homeworld)),
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

  const sanitize = (data, unit = '') =>
    data === 'unknown' ? 'No Record' : data + unit;

  const handleGender = gender =>
    gender === 'n/a' || gender === 'none'
      ? 'Droid'
      : `${gender[0].toUpperCase()}${gender.slice(1)}`;

  const handleEndpoints = async props => {
    let result = await Axios.get(`${props}`);
    return Promise.resolve(result.data.name);
  };
  const handleSpecies = specie => (specie === undefined ? 'Human' : specie);

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
