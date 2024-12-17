import React from "react";
import "./HelpPage.css";

const HelpPage = () => {
    return (
        <div className="help-page">
            <h1>Help</h1>
            <div className="help-container">
                <div className="accordion">
                    <div className="accordion-item">
                        <h3>About us</h3>
                        <div className="accordion-content">
                            <p>Learn more about CellVerse and its mission.</p>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h3>Explore the database</h3>
                        <div className="accordion-content">
                            <p>Tips on how to efficiently explore the CellVerse database.</p>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h3>Search specific terms</h3>
                        <div className="accordion-content">
                            <p>Find out how to use the search functionality to locate specific cells.</p>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h3>Like your favourite cells</h3>
                        <div className="accordion-content">
                            <p>Save your favourite cells for easy access later.</p>
                        </div>
                    </div>
                </div>
                <div className="contact-info">
                    <h2>CellVerse</h2>
                    <p>Application of HealthHackers</p>
                    <p>Contact us: <a href="mailto:healthhackers@imperial.ac.uk">healthhackers@imperial.ac.uk</a></p>
                    <p>Phone: 07412345678</p>
                </div>
            </div>
            <div className="faq">
                <h3>Frequently asked questions:</h3>
                <ul>
                    <li>How many images can I add at a time?</li>
                    <li>How can I add my own tags?</li>
                    <li>How is cell of the week chosen?</li>
                    <li>How does the app analyse the images?</li>
                    <li>How can I change my password?</li>
                </ul>
            </div>
        </div>
    );
};

export default HelpPage;
