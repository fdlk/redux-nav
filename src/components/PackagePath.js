import React, {PropTypes} from "react";

const PackagePath = ({packagePath, handleSelectPackage}) => {
    return <ol className="breadcrumb">
        {packagePath.map((p, i) => <li><a href="#" onClick={(e) => {
            e.preventDefault();
            handleSelectPackage(p.fullName)
        }}>{p.label}</a></li>)}
    </ol>
}

PackagePath.propTypes = {
    packagePath: PropTypes.array.isRequired,
    handleSelectPackage: PropTypes.func
}

export default PackagePath
