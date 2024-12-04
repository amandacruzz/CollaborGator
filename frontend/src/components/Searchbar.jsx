// src/components/SearchBar.jsx
import React, { useState } from "react";
import { TextField, Box } from "@mui/material";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value);  // Pass the query to the parent component (Home)
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "20px auto" }}>
      <TextField
        label="Search Projects"
        variant="outlined"
        fullWidth
        value={query}
        onChange={handleChange}
        sx={{
          backgroundColor: "#fff",
          borderRadius: "4px",
        }}
      />
    </Box>
  );
};

export default SearchBar;
