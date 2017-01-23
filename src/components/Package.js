import React, {PropTypes} from "react";

const Package = ({entityTypes, packages, handleSelectPackage, handleSelectEntityType}) => (
    <table className="table">
        <thead>
        <tr>
            <th></th>
            <th>name</th>
            <th>description</th>
        </tr>
        </thead>
        <tbody>
        {packages.map((pack, i) =>
            <tr key={"P" + i} onClick={() => handleSelectPackage(pack.fullName)}>
                <td><span className="glyphicon glyphicon-folder-open" aria-hidden="true"></span></td>
                <td>{pack.label}</td>
                <td>{pack.description}</td>
            </tr>)}
        {entityTypes.map((entityType, i) =>
            <tr key={"E" + i} onClick={() => handleSelectEntityType(entityType.fullName)}>
                <td><span className="glyphicon glyphicon-list" aria-hidden="true"></span></td>
                <td>{entityType.label}</td>
                <td>{entityType.description}</td>
            </tr>)}
        </tbody>
    </table>)

Package.propTypes = {
    entityTypes: PropTypes.array.isRequired,
    packages: PropTypes.array.isRequired,
    handleSelectEntityType: PropTypes.func,
    handleSelectPackage: PropTypes.func
}

export default Package
