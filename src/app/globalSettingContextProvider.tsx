import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import apiSettingService from '@/apiServices/externalApiServices/apiSettingService';
import { GlobalSettingContext } from '@/contexts/globalSettingContext';
import GlobalSettingModel from '@/contexts/globalSettingModel';
import { Component } from 'react';
import authApiService from '../apiServices/externalApiServices/authApiService';
class GlobalSettingContextProvider extends Component<any, GlobalSettingModel> {
  private isGettingCurrentUser: boolean = false;
  private isGettingKeywordBanned: boolean = false;
  private isGettingSettingLandingPage: boolean = false;
  private isGettingProvince: boolean = false;
  private isGettingDistrict: boolean = false;
  private isGettingPropertyType: boolean = false;
  constructor(props: any) {
    super(props);
    this.state = {
      ...this.getInitialState(),
    };
  }

  getInitialState = (): GlobalSettingModel => ({
    currentUser: null,
    keyword: null,
    allSettingLandingPage: this.props.settingLandingPage,
    listProvince: null,
    listDistrict: null,
    listWard: null,
    listPropertyType: null,
  });

  resetState = () => {
    this.setState(this.getInitialState());
  };

  render() {
    return (
      <GlobalSettingContext.Provider
        value={{
          keyword: this.state.keyword,
          getKeywordBlacklist: async () => {
            try {
              if (!this.isGettingKeywordBanned) {
                this.isGettingKeywordBanned = true;
                const response = await apiMasterDataService.getKeywordBlacklist();
                if (response) {
                  this.setState({ keyword: response.data });
                }
              }
            } catch (e) {
              console.log(e);
              return null;
            } finally {
              setTimeout(() => {
                this.isGettingKeywordBanned = false;
              }, 1000);
            }
          },

          getProvince: async () => {
            try {
              if (!this.isGettingProvince) {
                this.isGettingProvince = true;
                const response = await apiMasterDataService.getProvinceV2();

                if (response) {
                  this.setState({ listProvince: response });
                }
              }
            } catch (e) {
              console.log(e);
              return null;
            } finally {
              setTimeout(() => {
                this.isGettingProvince = false;
              }, 1000);
            }
          },
          listProvince: this.state.listProvince,

          getDistrict: async () => {
            try {
              if (!this.isGettingDistrict) {
                this.isGettingDistrict = true;
                const response = await apiMasterDataService.getAllDistric();

                if (response) {
                  this.setState({ listDistrict: response });
                }
              }
            } catch (e) {
              console.log(e);
              return null;
            } finally {
              setTimeout(() => {
                this.isGettingDistrict = false;
              }, 1000);
            }
          },
          listDistrict: this.state.listDistrict,

          getWard: async () => {
            try {
              if (!this.isGettingDistrict) {
                this.isGettingDistrict = true;
                const response = await apiMasterDataService.getAllWard();

                if (response) {
                  this.setState({ listWard: response });
                }
              }
            } catch (e) {
              console.log(e);
              return null;
            } finally {
              setTimeout(() => {
                this.isGettingDistrict = false;
              }, 1000);
            }
          },
          listWard: this.state.listWard,

          allSettingLandingPage: this.state.allSettingLandingPage,
          getAllSettingLandingPage: async () => {
            try {
              if (!this.isGettingSettingLandingPage) {
                this.isGettingSettingLandingPage = true;
                const response = await apiSettingService.getSettingServiceLandingPage();
                if (response) {
                  this.setState({ allSettingLandingPage: response.data });
                }
              }
            } catch (e) {
              console.log(e);
              return null;
            } finally {
              setTimeout(() => {
                this.isGettingSettingLandingPage = false;
              }, 1000);
            }
          },
          listPropertyType: this.state.listPropertyType,
          getPropertyType: async () => {
            try {
              if (!this.isGettingPropertyType) {
                this.isGettingPropertyType = true;
                const response = await apiMasterDataService.getPropertyTypes();
                if (response) {
                  this.setState({ listPropertyType: response.data });
                }
              }
            } catch (e) {
              console.log(e);
              return null;
            } finally {
              setTimeout(() => {
                this.isGettingPropertyType = false;
              }, 1000);
            }
          },
          currentUser: this.state.currentUser,
          getCurrentUser: async () => {
            if (!this.isGettingCurrentUser) {
              this.isGettingCurrentUser = true;
              try {
                const response = await authApiService.getCurrentUser();
                if (response.success && response.data) {
                  this.setState({ currentUser: response.data });
                }
              } catch (err) {
                console.error(err);
                return null;
              } finally {
                this.isGettingCurrentUser = false;
              }
            }
          },
          unsetCurrentUser: () => {
            this.setState({ currentUser: null });
          },
          resetState: () => {
            this.resetState();
          },
        }}
      >
        {this.props.children}
      </GlobalSettingContext.Provider>
    );
  }
}

export default GlobalSettingContextProvider;
