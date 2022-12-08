using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using DasGlobal.Extensions;
using Newtonsoft.Json;

namespace DasGlobal.Classes
{
    public enum StatusCode
    {
        //
        // Resumen:
        //     Equivalente al código de estado HTTP 200. System.Net.HttpStatusCode.OK indica
        //     que la solicitud se realizó correctamente y la información solicitada en la respuesta.
        //     Este es el código de estado más común para recibir.
        Ok = 200,

        //
        // Resumen:
        //     Equivalente al código de estado HTTP 201. System.Net.HttpStatusCode.Created indica
        //     que la solicitud dio como resultado un nuevo recurso creado antes de enviar la
        //     respuesta.
        Created = 201,

        //
        // Resumen:
        //     Equivalente al código de estado HTTP 400. System.Net.HttpStatusCode.BadRequest
        //     indica que la solicitud no entendió el servidor. System.Net.HttpStatusCode.BadRequest
        //     se envía cuando ningún otro error es aplicable, o si el error exacto es desconocido
        //     o no tiene su propio código de error.
        BadRequest = 400,

        //
        // Resumen:
        //     Equivalente al código de estado HTTP 401. System.Net.HttpStatusCode.Unauthorized
        //     indica que el recurso solicitado requiere autenticación. El encabezado WWW-Authenticate
        //     contiene los detalles de cómo realizar la autenticación.
        Unauthorized = 401,

        Forbidden = 403,

        //
        // Resumen:
        //     Equivalente al código de estado HTTP 404. System.Net.HttpStatusCode.NotFound
        //     indica que el recurso solicitado no existe en el servidor.
        NotFound = 404,

        //
        // Resumen:
        //     Equivalente al código de estado HTTP 409. System.Net.HttpStatusCode.Conflict
        //     indica que no se pudo realizar la solicitud debido a un conflicto en el servidor.
        Conflict = 409,

        //
        // Resumen:
        //     Equivalente al código de estado HTTP 500. System.Net.HttpStatusCode.InternalServerError
        //     indica que se ha producido un error genérico en el servidor.
        InternalServerError = 500,

        //
        // Resumen:
        //     Equivalente al código de estado HTTP 500. System.Net.HttpStatusCode.InternalServerError
        //     indica que se ha producido un error genérico en el servidor.
        UnprocessableEntity = 422
    }

    public class ResponseManager
    {
        public JsonResult SuccessResponse(object data, StatusCode code = StatusCode.Ok)
        {
            var result = new JsonResult
                         {
                             Data          = new { data, code = (int)code },
                             MaxJsonLength = Int32.MaxValue
                         };

            if (HttpContext.Current.Request.HttpMethod == HttpMethod.Get.Method)
            {
                result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            }

            return result;
        }

        public JsonResult ErrorResponse(object data, StatusCode code, StatusCode? obligateCode)
        {
            var result = new JsonResult
                         {
                             Data = new
                                    {
                                        errors = data,
                                        code   = obligateCode == null ? (int)code : (int)obligateCode
                                    }
                         };

            if (HttpContext.Current.Request.HttpMethod == HttpMethod.Get.Method)
            {
                result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            }

            HttpContext.Current.Response.StatusCode = (int)code;

            return result;
        }

        public ActionResult Forbidden()
        {
            return IsAjaxRequest()
                       ? UnprocessableEntity("No tiene permisos para realizar está solicitud")
                       : new RedirectResult("/");
        }

        public ActionResult NotFound()
        {
            if (IsAjaxRequest())
            {
                return ErrorResponse("No se pudo encontrar el recurso", StatusCode.NotFound, null);
            }

            return new HttpStatusCodeResult(HttpStatusCode.NotFound);
        }

        public ActionResult Conflict()
        {
            if (IsAjaxRequest())
            {
                return ErrorResponse("El recurso ya está en uso", StatusCode.Conflict, null);
            }

            return new HttpStatusCodeResult(HttpStatusCode.Conflict);
        }

        public ActionResult UnprocessableEntity(string error = "No se pudo realizar la operación", bool externo = false)
        {
            var errorDictionary = new Dictionary<string, string>
                                  {
                                      { "Error", error.CleanString() }
                                  };

            return externo
                       ? new JsonResult
                         {
                             Data = new
                                    {
                                        errors = errorDictionary,
                                        code   = StatusCode.UnprocessableEntity
                                    },
                             JsonRequestBehavior = JsonRequestBehavior.AllowGet
                         }
                       : UnprocessableEntity(errorDictionary);
        }

        public ActionResult UnprocessableEntity(List<string> mensajes, bool externo = false)
        {
            var erroresDiccionario = new Dictionary<string, string>();

            var contador = 0;
            foreach (var mensaje in mensajes)
            {
                erroresDiccionario.Add(contador + "", mensaje);
                contador++;
            }

            return externo
                       ? new JsonResult
                         {
                             Data = new
                                    {
                                        errors = erroresDiccionario,
                                        code   = StatusCode.UnprocessableEntity
                                    },
                             JsonRequestBehavior = JsonRequestBehavior.AllowGet
                         }
                       : UnprocessableEntity(erroresDiccionario);
        }

        public ActionResult UnprocessableEntity(Dictionary<string, string> errors)
        {
            return ErrorResponse(errors, StatusCode.UnprocessableEntity, null);
        }


        public ActionResult File(string ruta, string mimeType, string descripcion)
        {
            var contentType = "";
            switch (mimeType)
            {
                case "json":
                    contentType = "application/json";
                    break;
            }

            var result = new FilePathResult(ruta, contentType)
                         {
                             FileDownloadName = $"{descripcion}.{mimeType}"
                         };


            return result;
        }

        public ActionResult InternalServerError(Exception exception)
        {
            return ErrorResponse(new
                                 {
                                     errors = new Dictionary<string, string> { { "error", exception.Message } }
                                 }, StatusCode.InternalServerError, null);
        }

        public bool IsAjaxRequest()
        {
            var request = HttpContext.Current.Request;
            return request.Headers["X-Requested-With"] == "XMLHttpRequest";
        }
    }
}