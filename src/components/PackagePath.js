import React, {PropTypes} from "react";
import {Breadcrumb} from "react-bootstrap";

const PackagePath = ({packagePath, handleSelectPackage}) =>
    <Breadcrumb>
        {packagePath.map((p, i) =>
            <Breadcrumb.Item
                key={p.fullName}
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    handleSelectPackage(p.fullName)
                }}>
                {p.label}
            </Breadcrumb.Item>)}
    </Breadcrumb>

PackagePath.propTypes = {
    packagePath: PropTypes.array.isRequired,
    handleSelectPackage: PropTypes.func
}

export default PackagePath
