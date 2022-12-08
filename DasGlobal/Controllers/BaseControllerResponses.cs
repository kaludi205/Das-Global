using System;
using System.Collections.Generic;
using System.Web.Mvc;
using DasGlobal.Classes;

namespace DasGlobal.Controllers
{
    public partial class BaseController
    {
        public JsonResult SuccessResponse(object data, StatusCode code = StatusCode.Ok)
        {
            return ResponseManager.SuccessResponse(data, code);
        }

        public JsonResult ErrorResponse(object data, StatusCode code, StatusCode? obligateCode)
        {
            return ResponseManager.ErrorResponse(data, code, obligateCode);
        }

        public ActionResult Forbidden()
        {
            return ResponseManager.Forbidden();
        }

        public ActionResult NotFound()
        {
            return ResponseManager.NotFound();
        }
        
        public ActionResult Conflict()
        {
            return ResponseManager.Conflict();
        }
        

        public ActionResult UnprocessableEntity(string message, bool externo = false)
        {
            return ResponseManager.UnprocessableEntity(message, externo);
        }

        public ActionResult UnprocessableEntity(List<string> mensajes, bool externo = false)
        {
            return ResponseManager.UnprocessableEntity(mensajes, externo);
        }
        
        public ActionResult UnprocessableEntity()
        {
            return ResponseManager.UnprocessableEntity();
        }

        public ActionResult UnprocessableEntity(Dictionary<string, string> errors)
        {
            return ResponseManager.UnprocessableEntity(errors);
        }

        public new ActionResult File(string ruta, string mimeType, string descripcion)
        {
            return ResponseManager.File(ruta, mimeType, descripcion);
        }

        public ActionResult InternalServerError(Exception exception)
        {
            return ResponseManager.InternalServerError(exception);
        }

        public bool IsAjaxRequest()
        {
            return ResponseManager.IsAjaxRequest();
        }
    }
}