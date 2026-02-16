function openModuleOrSubmenu(moduleId, link, name) {
    $('#menu-header').html(name)
    console.log(link);
    $('#ProgressImg').show();
    if (link != null && link != '' && link != undefined && link != 'N') {
        window.location.href = link;
    }
    else {

        $('#ProgressImg').hide();
        var url = '/TimeSheet/DashboardList?moduleId=' + moduleId;
        window.location.href = url;
    }
    $('#ProgressImg').hide();
}
