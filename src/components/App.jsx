/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid, List, ListItem, ListItemText, ListSubheader,
} from '@material-ui/core';

const App = () => {
  const [data, setData] = useState([]);

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
    <Grid
      container
      direction="row"
      alignContent="center"
      xs={12}
    >
      {
        data.map((listIdGroup, index) => (
          <Grid item xs={3} key={`group${index}`}>
            <List subheader={<ListSubheader>{`ListId: ${index}`}</ListSubheader>}>
              {
                listIdGroup.map((listItem) => (
                  <ListItem key={`${listItem.name}-${listItem.id}-${listItem.listId}`}>
                    <ListItemText primary={`Name: ${listItem.name}`} secondary={`Id: ${listItem.id} ListId: ${listItem.listId}`} />
                  </ListItem>
                ))
              }
            </List>
          </Grid>
        ))
      }
    </Grid>
  );
};

export default App;
