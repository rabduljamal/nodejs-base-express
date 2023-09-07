var controllers_router = async function(){
  const route = '/api/v1';
  const route_path = appDir + '/app/controllers/api/v1';
  // const FindFiles = require('file-regex');

  // const fileControllers = await FindFiles(route_path, /\/Dashboard\/.*?\.js$/g, 5);

  // await fileControllers.map((file)=>{
  //   if(file.dir.split('/').length > 9){
  //     var data = require(route_path+'/'+file.dir.split('/')[10]);
  //     app.use(route+'/'+file.dir.split('/')[10], data);
  //   }
  // })

  // #app.use(route+'/role', require(route_path+'/Role/RoleControllers'));
  // #app.use(route+'/dashboard', require(route_path+'/Dashboard/DashboardControllers'));
  // #app.use(route+'/area', require(route_path+'/DataMaster/AreaControllers'));
  // #app.use(route+'/menu', require(route_path+'/Menu/MenuItemControllers'));
  // #app.use(route+'/menu/master', require(route_path+'/Menu/MasterMenuControllers'));
  app.use(route+'/oauth', require(route_path+'/Auth/AuthControllers'));
  app.use(route+'/banner', require(route_path+'/Banner/BannerControllers'));
  // #app.use(route+'/user-dashboard', require(route_path+'/User/UserDashboardController'));

}

module.exports = controllers_router;
