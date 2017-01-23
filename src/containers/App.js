import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {selectPackage, invalidatePackage, fetchPackageIfNeeded, getPackagePath} from "../ducks/packages";
import Package from "../components/Package";
import PackagePath from "../components/PackagePath";

class App extends Component {
    static propTypes = {
        selectedPackage: PropTypes.string.isRequired,
        packagePath: PropTypes.array.isRequired,
        label: PropTypes.string,
        description: PropTypes.string,
        entityTypes: PropTypes.array.isRequired,
        packages: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        dispatch: PropTypes.func.isRequired
    }

    componentDidMount() {
        const {dispatch, selectedPackage} = this.props
        dispatch(fetchPackageIfNeeded(selectedPackage))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedPackage !== this.props.selectedPackage) {
            const {dispatch, selectedPackage} = nextProps
            dispatch(fetchPackageIfNeeded(selectedPackage))
        }
    }

    handleSelectPackage = id => {
        this.props.dispatch(selectPackage(id))
    }

    handleSelectEntityType = id => {
        window.location.href = `http://localhost:8080/menu/main/dataexplorer?entity=${id}`
    }

    handleRefreshClick = e => {
        e.preventDefault()
        const {dispatch, selectedPackage} = this.props
        dispatch(invalidatePackage(selectedPackage))
        dispatch(fetchPackageIfNeeded(selectedPackage))
    }

    render() {
        const {selectedPackage, packagePath, label, description, entityTypes, packages, isFetching, lastUpdated} = this.props
        const isEmpty = (entityTypes.length + packages.length) === 0
        return (
            <div className="container">
                <h1>{label || selectedPackage}</h1>
                <p>{description}</p>
                <PackagePath packagePath={packagePath} handleSelectPackage={this.handleSelectPackage}/>
                <p>
                    {lastUpdated &&
                    <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
                        {' '}
            </span>
                    }
                    {!isFetching &&
                    <a href="#"
                       onClick={this.handleRefreshClick}>
                        Refresh
                    </a>
                    }
                </p>
                {isEmpty
                    ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                    : <div style={{opacity: isFetching ? 0.5 : 1}}>
                        <Package
                            entityTypes={entityTypes}
                            packages={packages}
                            handleSelectEntityType={this.handleSelectEntityType}
                            handleSelectPackage={this.handleSelectPackage}/>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {selectedPackage, packages} = state
    const packagePath = getPackagePath(state)
    const {
        isFetching,
        label,
        description,
        lastUpdated,
        entityTypes,
        children
    } = packages[selectedPackage] || {
        isFetching: true,
        label: "",
        description: "",
        children: [],
        entityTypes: [],
    }

    return {
        selectedPackage,
        packagePath,
        label,
        description,
        packages: children,
        entityTypes,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(App)
