dashboardPage(
  dashboardHeader(
    title= icon("car")
  ),
  dashboardSidebar(
    sidebarMenu(
      id = "sidebarMenu",
      menuItem(
        "Menu Item", 
        icon = icon("wrench"),
        menuSubItem("Menu Sub-Item", tabName="subItemTab")
      )
    )
  ),
  dashboardBody(
    useShinyjs(),
    tags$head(
      tags$link(rel = "stylesheet", type = "text/css", href = "https://fonts.googleapis.com/css?family=Play"),
      tags$link(rel = "stylesheet", type = "text/css", href = "style.css"),
      tags$script(src="d3.min.js"),
      tags$script(src="d3-scale-chromatic.v1.min.js"),
      tags$script(src="tooltip.js"),
      tags$script(src="matrixGrid.js"),
      tags$script(HTML("$(function() {
                   $('body').css('transition',0).addClass('sidebar-mini',0).addClass('sidebar-collapse',0);
                  // $('.logo').click(function() { $('.sidebar-toggle').click();});
                   });"))
    ),
    tabItems(
      tabItem(
        tabName = "subItemTab",
        box()
      )
    )
  )
)