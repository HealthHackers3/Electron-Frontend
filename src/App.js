import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import SearchPage from "./SearchPage";
import DetailsPage from "./DetailsPage";
import HelpPage from "./HelpPage"; // future implementation req
import UserPage from "./UserPage"; // future implementation req
import NewEntryPage from "./NewEntryPage"; // future implementation req
import Header from "./Header";

const App = () => {
    return (
        <Router>
            <Header /> {/* Navigation bar included in all pages */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/details/:id" element={<DetailsPage />} />
                <Route path="/help" element={<HelpPage />} /> {/* future implementation req */}
                <Route path="/user" element={<UserPage />} /> {/* future implementation req */}
                <Route path="/new-entry" element={<NewEntryPage />} /> {/* future implementation req */}
            </Routes>
        </Router>
    );
};

export default App;
