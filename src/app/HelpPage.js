import React, { useState } from "react";
import "./HelpPage.css";

const HelpPage = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="help-page">
            <h1>FAQ</h1>
            <div className="help-container">
                <div className="accordion">
                    {[
                        {
                            title: "What is CellVerse?",
                            content: "CellVerse is a desktop application o help you manage your data. " +
                                "It creates a database for your cell images and gives you the opportunity to store and edit " +
                                "all the relevant information about them."
                        },
                        {
                            title: "How can I add my own tags?",
                            content: "If the tag you want to add does not yet exist," +
                                "you can add it by typing the tag label and clicking add new tag."
                        },
                        {
                            title: "How is cell of the week chosen?",
                            content: "Cell of the week is chosen randomly very Monday at 00:00"
                        },
                        {
                            title: "How many images can I add at a time?",
                            content: "CellVerse supports uploading multiple images at once, so there is no upper limit on how many images can be added to a single entry."
                        },
                        {
                            title: "How does the app analyse the images?",
                            content: "An algorithm analyses the images you upload, counts cells and extracts their dimensions."
                        },
                    ].map((item, index) => (
                        <div
                            className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
                            key={index}
                            onClick={() => toggleAccordion(index)}
                        >
                            <h3>{item.title}</h3>
                            <div className="accordion-content">
                                <p>{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p> Your question was not answered above? Reach out! We will be happy to help. </p>

                <div className="contact-info">
                    <h2>CellVerse</h2>
                    <p>Application of HealthHackers</p>
                    <p>Contact us: <a href="mailto:healthhackers@imperial.ac.uk">healthhackers@imperial.ac.uk</a></p>
                    <p>Phone: 07412345678</p>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
