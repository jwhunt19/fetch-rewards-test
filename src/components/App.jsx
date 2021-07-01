/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableContainer, Table, TableCell, TableRow, TableHead, TableBody, Paper,
} from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

const App = () => {
  const [data, setData] = useState([]);

  const classes = useStyles();

  const handleData = () => {
    axios.get('/api/list')
      // Filter out items where name is equal to null or an empty string
      .then((res) => res.data.filter((x) => x.name !== null && x.name.length > 0))
      // Sort by listId, then by name using id since the number is the same
      .then((list) => list.sort((a, b) => {
        if (a.listId === b.listId) {
          return a.id - b.id;
        }
        return a.listId - b.listId;
      }))
      // split into separate arrays for displaying data
      .then((list) => {
        const map = [];
        list.map((i) => {
          if (map[i.listId] === undefined) map[i.listId] = [];
          return map[i.listId].push(i);
        });
        return map;
      })
      .then((x) => setData(x))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    data.map((listIdGroup, index) => (
      <TableContainer component={Paper} key={`group${index}`}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left"><b>List Id</b></TableCell>
              <TableCell align="center"><b>Name</b></TableCell>
              <TableCell align="right"><b>Id</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listIdGroup.map((item) => (
              <TableRow key={item.name}>
                <TableCell size="small">{item.listId}</TableCell>
                <TableCell align="center">{item.name}</TableCell>
                <TableCell align="right">{item.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ))
  );
};

export default App;
